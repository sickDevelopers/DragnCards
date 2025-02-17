defmodule SpadesGame.GameUIServer do
  @moduledoc """
  GenServer for holding GameUI state.
  """
  use GenServer
  @timeout :timer.minutes(60)

  require Logger
  alias SpadesGame.{Game, Card, GameOptions, GameUI, GameRegistry, Groups, User, Stack, Tokens}

  def is_player(gameui, user_id) do
    ids = gameui["playerIds"]
    if Enum.member?([ids["player1"], ids["player2"], ids["player3"], ids["player4"]], user_id) do
        true
    else
        false
    end
  end

  @doc """
  start_link/3: Generates a new game server under a provided name.
  """
  @spec start_link(String.t(), User.t(), %GameOptions{}) :: {:ok, pid} | {:error, any}
  def start_link(gameName, user, %GameOptions{} = options) do
    IO.puts("gameuiserver: start_link a")
    GenServer.start_link(__MODULE__, {gameName, user, options}, name: via_tuple(gameName))
    IO.puts("gameuiserver: start_link b")
  end

  @doc """
  via_tuple/1: Given a game name string, generate a via tuple for addressing the game.
  """
  def via_tuple(gameName),
    do: {:via, Registry, {SpadesGame.GameUIRegistry, {__MODULE__, gameName}}}

  @doc """
  gameui_pid/1: Returns the `pid` of the game server process registered
  under the given `gameName`, or `nil` if no process is registered.
  """
  def gameui_pid(gameName) do
    gameName
    |> via_tuple()
    |> GenServer.whereis()
  end

  @doc """
  state/1:  Retrieves the game state for the game under a provided name.
  """
  @spec state(String.t()) :: GameUI.t() | nil
  def state(gameName) do
    IO.puts("game_ui_server state")
    # IO.inspect(GenServer.call(via_tuple(gameName), :state))
    case gameui_pid(gameName) do
      nil -> nil
      _ -> GenServer.call(via_tuple(gameName), :state)
    end
  end

  @spec game_exists?(String.t()) :: boolean
  def game_exists?(gameName) do
    gameui_pid(gameName) != nil
  end

  @doc """
  update_gameui/3: The game is updated.
  """
  @spec update_gameui(String.t(), integer,  GameUI.t()):: GameUI.t()
  def update_gameui(gameName, user_id, gameui) do
    IO.puts("game_ui_server: update_gameui")
    GenServer.call(via_tuple(gameName), {:update_gameui, user_id, gameui})
  end

  @doc """
  load_cards/3: Cards are loaded.
  """
  @spec load_cards(String.t(), integer,  List.t()):: GameUI.t()
  def load_cards(gameName, user_id, load_list) do
    IO.puts("game_ui_server: load_cards")
    IO.inspect(load_list)
    GenServer.call(via_tuple(gameName), {:load_cards, user_id, load_list})
  end

  @doc """
  reset_game/2: Cards are loaded.
  """
  @spec reset_game(String.t(), integer):: GameUI.t()
  def reset_game(gameName, user_id) do
    GenServer.call(via_tuple(gameName), {:reset_game, user_id})
  end

  @doc """
  peek_at/7: A player just moved a stack.
  """
  @spec peek_at(String.t(), integer, String.t(), List.t(), List.t(), String.t(), boolean) :: GameUI.t()
  def peek_at(gameName, user_id, group_id, stack_indices, card_indices, player_n, reset_peek) do
    IO.puts("game_ui_server: peek_at")
    GenServer.call(via_tuple(gameName), {:peek_at, user_id, group_id, stack_indices, card_indices, player_n, reset_peek})
  end


  @doc """
  move_stack/7: A player just moved a stack.
  """
  @spec move_stack(String.t(), integer, String.t(), String.t(), number, boolean, boolean) :: GameUI.t()
  def move_stack(gameName, user_id, stack_id, dest_group_id, dest_stack_index, combine, preserve_state) do
    IO.puts("game_ui_server: move_stack")
    GenServer.call(via_tuple(gameName), {:move_stack, user_id, stack_id, dest_group_id, dest_stack_index, combine, preserve_state})
  end

  @doc """
  move_stack/6: Move all stacks from one group to another group, where position = t (top), b (bottom), s (shuffle in) to new group.
  """
  @spec move_stacks(String.t(), integer, String.t(), String.t(), String.t()) :: GameUI.t()
  def move_stacks(gameName, user_id, orig_group_id, dest_group_id, position) do
    IO.puts("game_ui_server: move_stacks")
    GenServer.call(via_tuple(gameName), {:move_stacks, user_id, orig_group_id, dest_group_id, position})
  end

  @doc """
  update_card/6: A player just updated a card.
  """
  @spec update_card(String.t(), integer, Card.t(), String.t(), number, number) :: GameUI.t()
  def update_card(gameName, user_id, card, group_id, stack_index, card_index) do
    IO.puts("game_ui_server: update_card")
    GenServer.call(via_tuple(gameName), {:update_card, user_id, card, group_id, stack_index, card_index})
  end

  @doc """
  increment_token/7: A player just incremented a token.
  """
  @spec increment_token(String.t(), integer, String.t(), number, number, String.t(), number) :: GameUI.t()
  def increment_token(gameName, user_id, group_id, stack_index, card_index, token_type, increment) do
    IO.puts("game_ui_server: increment_token")
    GenServer.call(via_tuple(gameName), {:increment_token, user_id, group_id, stack_index, card_index, token_type, increment})
  end

  @doc """
  deal_shadow/4: A player just dealt a shadow card.
  """
  @spec deal_shadow(String.t(), integer, String.t(), number) :: GameUI.t()
  def deal_shadow(gameName, user_id, group_id, stack_index) do
    IO.puts("game_ui_server: deal_shadow")
    GenServer.call(via_tuple(gameName), {:deal_shadow, user_id, group_id, stack_index})
  end

  @doc """
  move_card/9: A player just moved a card.
  """
  @spec move_card(String.t(), integer, String.t(), String.t(), number, number, boolean) :: GameUI.t()
  def move_card(gameName, user_id, card_id, dest_group_id, dest_stack_index, dest_card_index, create_new_stack) do
    IO.puts("game_ui_server: move_card")
    GenServer.call(via_tuple(gameName), {:move_card, user_id, card_id, dest_group_id, dest_stack_index, dest_card_index, create_new_stack})
  end

  @doc """
  shuffle/5: Shuffle a group.
  """
  @spec shuffle_group(String.t(), integer, String.t()) :: GameUI.t()
  def shuffle_group(gameName, user_id, group_id) do
    IO.puts("game_ui_server: shuffle_group")
    GenServer.call(via_tuple(gameName), {:shuffle_group, user_id, group_id})
  end

  @doc """
  toggle_exhaust/5: A player just exhausted/unexhausted a card.
  """
  @spec toggle_exhaust(String.t(), integer, String.t(), integer, integer) :: GameUI.t()
  def toggle_exhaust(gameName, user_id, group_id, stack_index, card_index) do
    IO.puts("game_ui_server: toggle_exhaust")
    GenServer.call(via_tuple(gameName), {:toggle_exhaust, user_id, group_id, stack_index, card_index})
  end

  @doc """
  card_action/5: Perform given action on a card.
  """
  @spec card_action(String.t(), integer, String.t(), String.t(), List.t()) :: GameUI.t()
  def card_action(gameName, user_id, action, card_id, options) do
    IO.puts("game_ui_server: card_action")
    GenServer.call(via_tuple(gameName), {:card_action, user_id, action, card_id, options})
  end

  @doc """
  game_action/4: Perform given action on a card.
  """
  @spec game_action(String.t(), integer, String.t(), Map.t()) :: GameUI.t()
  def game_action(gameName, user_id, action, options) do
    IO.puts("game_ui_server: game_action")
    GenServer.call(via_tuple(gameName), {:game_action, user_id, action, options})
  end

  @doc """
  action_on_matching_cards/5: Perform given action on matching cards.
  """
  @spec action_on_matching_cards(String.t(), integer, List.t(), String.t(), List.t()) :: GameUI.t()
  def action_on_matching_cards(gameName, user_id, criteria, action, options) do
    IO.puts("game_ui_server: action_on_matching_cards")
    GenServer.call(via_tuple(gameName), {:action_on_matching_cards, user_id, criteria, action, options})
  end

  @doc """
  round/3: A player changes the round step
  """
  @spec refresh(String.t(), integer, String.t()) :: GameUI.t()
  def refresh(gameName, user_id, player_n) do
    IO.puts("game_ui_server: refresh")
    GenServer.call(via_tuple(gameName), {:refresh, player_n})
  end

  @doc """
  set_first_player/3: Set first player
  """
  @spec set_first_player(String.t(), integer, String.t()) :: GameUI.t()
  def set_first_player(gameName, user_id, player_n) do
    IO.puts("game_ui_server: refresh")
    GenServer.call(via_tuple(gameName), {:set_first_player, player_n})
  end

  @doc """
  increment_threat/4: A player changes the round step
  """
  @spec increment_threat(String.t(), integer, String.t(), number) :: GameUI.t()
  def increment_threat(gameName, user_id, player_n, increment) do
    IO.puts("game_ui_server: increment_threat")
    GenServer.call(via_tuple(gameName), {:increment_threat, player_n, increment})
  end

  @doc """
  increment_round/3: A player increments the round number
  """
  @spec increment_round(String.t(), integer, number) :: GameUI.t()
  def increment_round(gameName, user_id, increment) do
    IO.puts("game_ui_server: increment_round")
    GenServer.call(via_tuple(gameName), {:increment_round, increment})
  end

  @doc """
  rewind_countdown_devtest/1: Make the "game start" countdown happen
  instantly.
  Works by moving back the "everyone sat down" timestamp by 10 minutes.
  Should be used in dev+test only.
  """
  def rewind_countdown_devtest(gameName) do
    GenServer.call(via_tuple(gameName), :rewind_countdown_devtest)
  end

  @doc """
  rewind_trickfull_devtest/1: Make a full trick advance to the next
  trick instantly.
  Should be used in dev+test only.
  """
  def rewind_trickfull_devtest(gameName) do
    GenServer.call(via_tuple(gameName), :rewind_trickfull_devtest)
  end

  @doc """
  sit/3: User is asking to sit in one of the seats.
  which_seat is "player1", "player2", "player3" or "player4".
  """
  @spec sit(String.t(), integer, String.t()) :: GameUI.t()
  def sit(gameName, user_id, player_n) do
    GenServer.call(via_tuple(gameName), {:sit, user_id, player_n})
  end

  @doc """
  leave/2: User just leave the room (Closed browser or clicked out).
  If they're in a seat, we need to mark them as gone.
  Maybe eventually there will be some sophisticated disconnect/reconnect
  system?
  """
  def leave(gameName, user_id) do
    GenServer.call(via_tuple(gameName), {:leave, user_id})
  end

  ## Temp function to set winner flag on a game
  def winner(gameName, winner_val) do
    GenServer.call(via_tuple(gameName), {:winner, winner_val})
  end

  #####################################
  ####### IMPLEMENTATION ##############
  #####################################

  def init({gameName, user, options = %GameOptions{}}) do
    IO.puts("game_ui_server init a")
    gameui =
      case :ets.lookup(:game_uis, gameName) do
        [] ->
          IO.puts("case 1")
          IO.inspect(user)
          gameui = GameUI.new(gameName, user, options)
          :ets.insert(:game_uis, {gameName, gameui})
          gameui

        [{^gameName, gameui}] ->
          IO.puts("case 2")
          gameui
      end

    IO.puts("game_ui_server init b")
    GameRegistry.add(gameui["gameName"], gameui)
    {:ok, gameui, timeout(gameui)}
  end

  def handle_call(:state, _from, state) do
    reply(state)
  end

  def handle_call(:invite_bots, _from, state) do
    IO.puts("handle call invite bots")
    push_state_to_clients_for_12_seconds()

    GameUI.invite_bots(state)
    |> save_and_reply()
  end

  def handle_call(:bots_leave, _from, state) do
    IO.puts("handle call bots leave")
    push_state_to_clients(3, 1000)

    GameUI.bots_leave(state)
    |> save_and_reply()
  end

  def handle_call(:bot_notify, _from, state) do
    IO.puts("handle call bot notify")
    push_state_to_clients(1, 0)

    state
    |> save_and_reply()
  end

  def handle_call({:update_gameui, user_id, updated_gameui}, _from, gameui) do
    IO.puts("game_ui_server: handle_call: update_gameui a")
    updated_gameui
    |> save_and_reply()
  end

  def handle_call({:load_cards, user_id, load_list}, _from, gameui) do
    IO.puts("game_ui_server: handle_call: load_list a")
    GameUI.load_cards(gameui, user_id, load_list)
    |> save_and_reply()
  end

  def handle_call({:reset_game, user_id}, _from, gameui) do
    IO.puts("game_ui_server: handle_call: load_list a")
    new_game = Game.new(gameui["options"])
    put_in(gameui["game"], new_game)
    |> save_and_reply()
  end

  def handle_call({:peek_at, user_id, group_id, stack_indices, card_indices, player_n, reset_peek}, _from, gameui) do
    GameUI.peek_at(gameui, group_id, stack_indices, card_indices, player_n, reset_peek)
    |> save_and_reply()
  end

  def handle_call({:move_stack, user_id, stack_id, dest_group_id, dest_stack_index, combine, preserve_state}, _from, gameui) do
    GameUI.move_stack(gameui, stack_id, dest_group_id, dest_stack_index, combine, preserve_state)
    |> save_and_reply()
  end

  def handle_call({:move_stacks, user_id, orig_group_id, dest_group_id, position}, _from, gameui) do
    GameUI.move_stacks(gameui, orig_group_id, dest_group_id, position)
    |> save_and_reply()
  end

  def handle_call({:update_card, user_id, new_card, group_id, stack_index, card_index}, _from, gameui) do
    GameUI.update_card(gameui, [group_id, stack_index, card_index], new_card)
    |> save_and_reply()
  end

  def handle_call({:increment_token, user_id, group_id, stack_index, card_index, token_type, increment}, _from, gameui) do
    GameUI.increment_token(gameui, [group_id, stack_index, card_index], [token_type, increment])
    |> save_and_reply()
  end

  def handle_call({:deal_shadow, user_id, group_id, stack_index}, _from, gameui) do
    GameUI.deal_shadow(gameui, [group_id, stack_index, 0])
    |> save_and_reply()
  end

  def handle_call({:shuffle_group, user_id, group_id}, _from, gameui) do
    GameUI.shuffle_group(gameui, group_id)
    |> save_and_reply()
  end

  def handle_call({:move_card, user_id, card_id, dest_group_id, dest_stack_index, dest_card_index, create_new_stack}, _from, gameui) do
    # Check if dest_stack_index is negative, meaning counting from the bottom
    IO.puts("game_ui_server move_card")
    GameUI.move_card(gameui, card_id, dest_group_id, dest_stack_index, dest_card_index, create_new_stack)
    |> save_and_reply()
  end

  def handle_call({:toggle_exhaust, user_id, group_id, stack_index, card_index}, _from, gameui) do
    IO.puts("game_ui_server: handle_call: toggle_exhaust a")
    GameUI.toggle_exhaust(gameui, [group_id, stack_index, card_index])
    |> save_and_reply()
  end

  def handle_call({:card_action, user_id, action, card_id, options}, _from, gameui) do
    IO.puts("game_ui_server: handle_call: card_action a")
    GameUI.card_action(gameui, action, card_id, options)
    |> save_and_reply()
  end

  def handle_call({:game_action, user_id, action, options}, _from, gameui) do
    IO.puts("game_ui_server: handle_call: game_action a")
    try do
      gameui = GameUI.game_action(gameui, user_id, action, options)
      put_in(gameui["error"], false)
    rescue
      e in RuntimeError ->
        IO.inspect(e)
        put_in(gameui["error"],true)
    end
    |> save_and_reply()
  end

  def handle_call({:action_on_matching_cards, user_id, criteria, action, options}, _from, gameui) do
    IO.puts("game_ui_server: handle_call: action_on_matching_cards a")
    GameUI.action_on_matching_cards(gameui, criteria, action, options)
    |> save_and_reply()
  end

  def handle_call({:update_value, user_id, path, value}, _from, gameui) do
    IO.puts("game_ui_server: handle_call: update_value a")
    GameUI.update_value(gameui, path, value)
    |> save_and_reply()
  end

  def handle_call({:refresh, player_n}, _from, gameui) do
    GameUI.refresh(gameui, player_n)
    |> save_and_reply()
  end

  def handle_call({:set_first_player, player_n}, _from, gameui) do
    put_in(gameui["game"]["firstPlayer"], player_n)
    |> save_and_reply()
  end

  def handle_call({:increment_threat, player_n, increment}, _from, gameui) do
    GameUI.increment_threat(gameui, player_n, increment)
    |> save_and_reply()
  end

  def handle_call({:increment_round, increment}, _from, gameui) do
    old_round_number = gameui["game"]["roundNumber"]
    put_in(gameui["game"]["roundNumber"], old_round_number + increment)
    |> save_and_reply()
  end

  def handle_call({:sit, user_id, player_n}, _from, gameui) do
    new_gameui = GameUI.sit(gameui, user_id, player_n)
    save_and_reply(new_gameui)
  end

  def handle_call({:leave, user_id}, _from, gameui) do
    GameUI.leave(gameui, user_id)
    |> save_and_reply()
  end

  # def handle_call({:winner, winner_val}, _from, gameui) do
  #   game = gameui.game
  #   game = %Game{game | winner: winner_val}

  #   %GameUI{gameui | game: game}
  #   |> save_and_reply()
  # end

  defp reply(new_gameui) do
    {:reply, new_gameui, new_gameui, timeout(new_gameui)}
  end

  defp save_and_reply(new_gameui) do
    # Async GameRegistry.update Should improve performance,
    # but causes tests to fail.  Not sure it's a real failure
    # spawn_link(fn ->

    IO.puts("game_ui_server: save_and_reply a")
    #IO.inspect(new_gameui)
    GameRegistry.update(new_gameui["gameName"], new_gameui)

    IO.puts("game_ui_server: save_and_reply b")
    # end)

    spawn_link(fn ->
      :ets.insert(:game_uis, {new_gameui["gameName"], new_gameui})
    end)

    IO.puts("game_ui_server: save_and_reply c")
    {:reply, new_gameui, new_gameui, timeout(new_gameui)}
  end

  # This is to handle the "Game Start" countdown.
  # 10 seconds after everyone sits down, the game begins.
  # We will spawn a process that calls ":state" every second
  # and pushes that state down to the clients, so they will see
  # the game status move to playing after 10 seconds.
  defp push_state_to_clients_for_12_seconds() do
    IO.puts("push state to clients for 12")
    {:ok} #push_state_to_clients(12, 1000)
  end

  defp push_state_to_clients(repeat_times, delay_ms) do
    IO.puts("push state to clients")
    pid = self()

    spawn_link(fn ->
      1..repeat_times
      |> Enum.each(fn _ ->
        Process.sleep(delay_ms)
        state = GenServer.call(pid, :state)
        SpadesWeb.RoomChannel.notify_from_outside(state["gameName"])
      end)
    end)
  end

  # timeout/1
  # Given the current state of the game, what should the
  # GenServer timeout be? (Games with winners expire quickly)
  defp timeout(_state) do
    IO.puts("timeout set")
    @timeout
  end

  # When timing out, the order is handle_info(:timeout, _) -> terminate({:shutdown, :timeout}, _)
  def handle_info(:timeout, state) do
    IO.puts("gameuiserv handle_info")
    {:stop, {:shutdown, :timeout}, state}
  end

  def terminate({:shutdown, :timeout}, state) do
    IO.puts("gameuiserv shutdown")
    Logger.info("Terminate (Timeout) running for #{state["gameName"]}")
    :ets.delete(:game_uis, state["gameName"])
    GameRegistry.remove(state["gameName"])
    :ok
  end

  # Do I need to trap exits here?
  def terminate(_reason, state) do
    IO.puts("terminating because")
    IO.inspect(_reason)
    Logger.info("Terminate (Non Timeout) running for #{state["gameName"]}")
    GameRegistry.remove(state["gameName"])
    :ok
  end
end




# defmodule SpadesGame.GameUIServer do
#   @moduledoc """
#   GenServer for holding GameUI state.
#   """
#   use GenServer
#   @timeout :timer.minutes(60)

#   require Logger
#   alias SpadesGame.{Card, GameOptions, GameUI, GameRegistry, Groups}
#   alias SpadesGame.{Game}

#   @doc """
#   start_link/2: Generates a new game server under a provided name.
#   """
#   @spec start_link(String.t(), %GameOptions{}) :: {:ok, pid} | {:error, any}
#   def start_link(gameName, %GameOptions{} = options) do
#     GenServer.start_link(__MODULE__, {gameName, options}, name: via_tuple(gameName))
#   end

#   @doc """
#   via_tuple/1: Given a game name string, generate a via tuple for addressing the game.
#   """
#   def via_tuple(gameName),
#     do: {:via, Registry, {SpadesGame.GameUIRegistry, {__MODULE__, gameName}}}

#   @doc """
#   gameui_pid/1: Returns the `pid` of the game server process registered
#   under the given `gameName`, or `nil` if no process is registered.
#   """
#   def gameui_pid(gameName) do
#     gameName
#     |> via_tuple()
#     |> GenServer.whereis()
#   end

#   @doc """
#   state/1:  Retrieves the game state for the game under a provided name.
#   """
#   @spec state(String.t()) :: GameUI.t() | nil
#   def state(gameName) do
#     case gameui_pid(gameName) do
#       nil -> nil
#       _ -> GenServer.call(via_tuple(gameName), :state)
#     end
#   end

#   @spec game_exists?(String.t()) :: boolean
#   def game_exists?(gameName) do
#     gameui_pid(gameName) != nil
#   end

#   @doc """
#   bid/3: A player just submitted a bid.
#   """
#   @spec bid(String.t(), integer | :bot, integer) :: GameUI.t()
#   def bid(gameName, user_id, bid_amount) do
#     GenServer.call(via_tuple(gameName), {:bid, user_id, bid_amount})
#   end

#   @doc """
#   play/3: A player just played a card.
#   """
#   @spec play(String.t(), integer | :bot, Card.t()) :: GameUI.t()
#   def play(gameName, user_id, card) do
#     GenServer.call(via_tuple(gameName), {:play, user_id, card})
#   end

#   @doc """
#   rewind_countdown_devtest/1: Make the "game start" countdown happen
#   instantly.
#   Works by moving back the "everyone sat down" timestamp by 10 minutes.
#   Should be used in dev+test only.
#   """
#   def rewind_countdown_devtest(gameName) do
#     GenServer.call(via_tuple(gameName), :rewind_countdown_devtest)
#   end

#   @doc """
#   rewind_trickfull_devtest/1: Make a full trick advance to the next
#   trick instantly.
#   Should be used in dev+test only.
#   """
#   def rewind_trickfull_devtest(gameName) do
#     GenServer.call(via_tuple(gameName), :rewind_trickfull_devtest)
#   end

#   @doc """
#   sit/3: User is asking to sit in one of the seats.
#   which_seat is "north", "west", "east" or "south".
#   """
#   @spec sit(String.t(), integer, String.t()) :: GameUI.t()
#   def sit(gameName, user_id, which_seat) do
#     GenServer.call(via_tuple(gameName), {:sit, user_id, which_seat})
#   end

#   @doc """
#   leave/2: User just leave the room (Closed browser or clicked out).
#   If they're in a seat, we need to mark them as gone.
#   Maybe eventually there will be some sophisticated disconnect/reconnect
#   system?
#   """
#   def leave(gameName, user_id) do
#     GenServer.call(via_tuple(gameName), {:leave, user_id})
#   end

#   ## Temp function to set winner flag on a game
#   def winner(gameName, winner_val) do
#     GenServer.call(via_tuple(gameName), {:winner, winner_val})
#   end

#   #####################################
#   ####### IMPLEMENTATION ##############
#   #####################################

#   def init({gameName, options = %GameOptions{}}) do
#     gameui =
#       case :ets.lookup(:game_uis, gameName) do
#         [] ->
#           gameui = GameUI.new(gameName, options)
#           :ets.insert(:game_uis, {gameName, gameui})
#           gameui

#         [{^gameName, gameui}] ->
#           gameui
#       end

#     GameRegistry.add(gameui.gameName, gameui)
#     {:ok, gameui, timeout(gameui)}
#   end

#   def handle_call(:state, _from, state) do
#     GameUI.checks(state)
#     |> reply()
#   end

#   def handle_call(:rewind_countdown_devtest, _from, state) do
#     GameUI.rewind_countdown_devtest(state)
#     |> save_and_reply()
#   end

#   def handle_call(:rewind_trickfull_devtest, _from, state) do
#     GameUI.rewind_trickfull_devtest(state)
#     |> save_and_reply()
#   end

#   def handle_call(:invite_bots, _from, state) do
#     push_state_to_clients_for_12_seconds()

#     GameUI.invite_bots(state)
#     |> save_and_reply()
#   end

#   def handle_call(:bots_leave, _from, state) do
#     push_state_to_clients(3, 1000)

#     GameUI.bots_leave(state)
#     |> save_and_reply()
#   end

#   def handle_call(:bot_notify, _from, state) do
#     push_state_to_clients(1, 0)

#     state
#     |> save_and_reply()
#   end

#   def handle_call({:bid, user_id, bid_amount}, _from, gameui) do
#     GameUI.bid(gameui, user_id, bid_amount)
#     |> save_and_reply()
#   end

#   def handle_call({:play, user_id, card}, _from, gameui) do
#     gameui = GameUI.play(gameui, user_id, card)

#     # A full trick takes a little while to go away
#     if GameUI.trick_full?(gameui) do
#       push_state_to_clients(2, 700)
#     end

#     gameui
#     |> save_and_reply()
#   end

#   def handle_call({:sit, user_id, which_seat}, _from, gameui) do
#     new_gameui = GameUI.sit(gameui, user_id, which_seat)

#     if new_gameui.when_seats_full != nil do
#       push_state_to_clients_for_12_seconds()
#     end

#     save_and_reply(new_gameui)
#   end

#   def handle_call({:leave, user_id}, _from, gameui) do
#     GameUI.leave(gameui, user_id)
#     |> save_and_reply()
#   end

#   def handle_call({:winner, winner_val}, _from, gameui) do
#     game = gameui.game
#     game = %Game{game | winner: winner_val}

#     %GameUI{gameui | game: game}
#     |> save_and_reply()
#   end

#   defp reply(new_gameui) do
#     {:reply, new_gameui, new_gameui, timeout(new_gameui)}
#   end

#   defp save_and_reply(new_gameui) do
#     # Async GameRegistry.update Should improve performance,
#     # but causes tests to fail.  Not sure it's a real failure
#     # spawn_link(fn ->

#     IO.puts("game_ui_server: save_and_reply a")
#     #IO.inspect(new_gameui)
#     GameRegistry.update(new_gameui.gameName, new_gameui)

#     IO.puts("game_ui_server: save_and_reply b")
#     # end)

#     spawn_link(fn ->
#       :ets.insert(:game_uis, {new_gameui.gameName, new_gameui})
#     end)

#     IO.puts("game_ui_server: save_and_reply c")
#     {:reply, new_gameui, new_gameui, timeout(new_gameui)}
#   end

#   # This is to handle the "Game Start" countdown.
#   # 10 seconds after everyone sits down, the game begins.
#   # We will spawn a process that calls ":state" every second
#   # and pushes that state down to the clients, so they will see
#   # the game status move to playing after 10 seconds.
#   defp push_state_to_clients_for_12_seconds() do
#     push_state_to_clients(12, 1000)
#   end

#   defp push_state_to_clients(repeat_times, delay_ms) do
#     pid = self()

#     spawn_link(fn ->
#       1..repeat_times
#       |> Enum.each(fn _ ->
#         Process.sleep(delay_ms)
#         state = GenServer.call(pid, :state)
#         SpadesWeb.RoomChannel.notify_from_outside(state.gameName)
#       end)
#     end)
#   end

#   # timeout/1
#   # Given the current state of the game, what should the
#   # GenServer timeout be? (Games with winners expire quickly)
#   defp timeout(_state) do
#     @timeout
#   end

#   # When timing out, the order is handle_info(:timeout, _) -> terminate({:shutdown, :timeout}, _)
#   def handle_info(:timeout, state) do
#     {:stop, {:shutdown, :timeout}, state}
#   end

#   def terminate({:shutdown, :timeout}, state) do
#     Logger.info("Terminate (Timeout) running for #{state.gameName}")
#     :ets.delete(:game_uis, state.gameName)
#     GameRegistry.remove(state.gameName)
#     :ok
#   end

#   # Do I need to trap exits here?
#   def terminate(_reason, state) do
#     Logger.info("Terminate (Non Timeout) running for #{state.gameName}")
#     GameRegistry.remove(state.gameName)
#     :ok
#   end
# end

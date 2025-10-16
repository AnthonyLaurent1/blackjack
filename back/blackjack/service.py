from .models import Game, Player
import random

def roll_die():
    return random.randint(1, 6)

def create_game(name: str) -> Game:
    return Game.objects.create(name=name)

def get_game(game_id: int) -> Game:
    return Game.objects.prefetch_related("players").get(id=game_id)

def add_player(game_id: int, name: str) -> Player:
    game = Game.objects.get(id=game_id)
    return Player.objects.create(name=name, game=game)

def next_turn(game: Game):
    players = list(game.players.all())
    total_players = len(players)
    if total_players == 0:
        return
    for _ in range(total_players):
        game.turn = (game.turn + 1) % total_players
        next_player = players[game.turn]
        if not next_player.stand and next_player.score <= 21:
            game.save()
            return


def check_end_condition(game: Game):
    players = list(game.players.all())
    active_players = [p for p in players if not p.stand and p.score <= 21]
    if any(p.score == 21 for p in players) or len(active_players) == 0:
        game.ended = True
        game.save()
        return True
    return False



def roll_dice(player_id: int):
    player = Player.objects.get(id=player_id)
    game = player.game

    if game.ended:
        return {"player_id": player.id, "roll": 0, "score": player.score, "message": "La partie est terminée."}

    if player.stand or player.score > 21:
        return {"player_id": player.id, "roll": 0, "score": player.score, "message": "Vous ne pouvez plus jouer."}

    players = list(game.players.all())
    current_player = players[game.turn]
    if current_player.id != player.id:
        return {"player_id": player.id, "roll": 0, "score": player.score, "message": "Ce n’est pas votre tour."}

    roll_value = roll_die()
    player.score += roll_value
    player.save()

    message = f"Vous avez lancé {roll_value} → total {player.score}"

    if player.score == 21:
        message = "Blackjack"
        game.ended = True
        game.save()
        return {"player_id": player.id, "roll": roll_value, "score": player.score, "message": message}
    
    elif player.score > 21:
        message = "Vous avez dépassé 21"
        player.stand = True 
        player.save()

    if not check_end_condition(game):
        next_turn(game)

    return {"player_id": player.id, "roll": roll_value, "score": player.score, "message": message}




def stand_player(player_id: int) -> Player:
    player = Player.objects.get(id=player_id)
    game = player.game

    if not game.ended:
        player.stand = True
        player.save()
        if not check_end_condition(game):
            next_turn(game)

    return player



def get_winner(game_id: int):
    game = Game.objects.prefetch_related("players").get(id=game_id)
    players = game.players.all()

    valid_players = [p for p in players if p.score <= 21]

    if not valid_players:
        return {"winners": [], "scores": {p.name: 0 for p in players}}

    max_score = max(p.score for p in valid_players)
    winners = [p.name for p in valid_players if p.score == max_score]

    scores = {p.name: (p.score if p.score <= 21 else 0) for p in players}

    return {"winners": winners, "scores": scores}



def serialize_player(player: Player):
    return {
        "id": player.id,
        "name": player.name,
        "score": player.score,
        "stand": player.stand,
    }


def serialize_game(game: Game):
    players = [serialize_player(p) for p in game.players.all()]
    return {
        "id": game.id,
        "name": game.name,
        "turn": game.turn,
        "ended": game.ended,
        "players": players,
    }

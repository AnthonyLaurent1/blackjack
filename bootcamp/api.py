from ninja import NinjaAPI, Schema
from blackjack.models import Game, Player
from typing import List
import random


api = NinjaAPI()

class PlayerSchema(Schema):
    id: int
    name: str
    score: int
    stand: bool

class GameSchema(Schema):
    id: int
    name: str
    turn: int
    ended: bool
    players: List[PlayerSchema] = []


class RollResult(Schema):
    player_id: int
    roll: int
    score: int
    message: str

class WinnerSchema(Schema):
    winners: List[str]
    scores: dict

def roll_die():
    return random.randint(1, 6)


class NameSchema(Schema):
    name: str

@api.post("/game/", response=GameSchema)
def create_game(request, data: NameSchema):
    game = Game.objects.create(name=data.name)
    return GameSchema(
        id=game.id,
        name=game.name,
        turn=game.turn,
        ended=game.ended,
        players=[]
    )


@api.get("/game/{game_id}/", response=GameSchema)
def get_game(request, game_id: int):
    try:
        game = Game.objects.prefetch_related("players").get(id=game_id)
    except Game.DoesNotExist:
        return {"id": 0, "name": "Non trouvé", "turn": 0, "ended": True, "players": []}

    players = [
        PlayerSchema(
            id=p.id,
            name=p.name,
            score=p.score,
            stand=p.stand
        ) for p in game.players.all()
    ]

    return GameSchema(
        id=game.id,
        name=game.name,
        turn=game.turn,
        ended=game.ended,
        players=players
    )


@api.post("/game/{game_id}/player/", response=PlayerSchema)
def add_player(request, game_id: int, data: NameSchema):
    game = Game.objects.get(id=game_id)
    player = Player.objects.create(name=data.name, game=game)  
    return PlayerSchema(
        id=player.id,
        name=player.name,
        score=player.score,
        stand=player.stand
    )


@api.post("/player/{player_id}/roll/", response=RollResult)
def roll(request, player_id: int):
    player = Player.objects.get(id=player_id)
    if player.stand:
        return RollResult(player_id=player.id, roll=0, score=player.score, message="Vous avez déjà passé")

    roll_value = roll_die()
    player.score += roll_value
    message = ""

    if player.score > 21:
        message = "Bust ! Vous avez dépassé 21"
        player.stand = True
    elif player.score == 21:
        message = "Blackjack ! Vous avez atteint 21"
        player.stand = True

    player.save()
    return RollResult(player_id=player.id, roll=roll_value, score=player.score, message=message)


@api.post("/player/{player_id}/stand/", response=PlayerSchema)
def stand(request, player_id: int):
    player = Player.objects.get(id=player_id)
    player.stand = True
    player.save()
    return PlayerSchema(
        id=player.id,
        name=player.name,
        score=player.score,
        stand=player.stand
    )

@api.get("/game/{game_id}/winner/", response=WinnerSchema)
def winner(request, game_id: int):
    try:
        game = Game.objects.prefetch_related("players").get(id=game_id)
    except Game.DoesNotExist:
        return WinnerSchema(winners=[], scores={}, message="Partie non trouvée")

    if game.players.count() < 1:
        return WinnerSchema(winners=[], scores={}, message="Aucun joueur dans la partie")

    if not all(p.stand for p in game.players.all()):
        return WinnerSchema(winners=[], scores={}, message="Tous les joueurs doivent avoir passé")

    scores = {p.name: p.score if p.score <= 21 else 0 for p in game.players.all()}

    max_score = max(scores.values())

    winners = [name for name, score in scores.items() if score == max_score and score > 0]

    game.ended = True
    game.save()

    return WinnerSchema(winners=winners, scores=scores)

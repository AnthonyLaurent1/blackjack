from ninja import NinjaAPI, Schema
from blackjack.models import Game
from blackjack import service
from blackjack.schemas import *


api = NinjaAPI()


@api.post("/game/", response=GameSchema)
def create_game(request, data: NameSchema):
    game = service.create_game(data.name)
    return service.serialize_game(game)


@api.get("/game/{game_id}/", response=GameSchema)
def get_game(request, game_id: int):
    game = service.get_game(game_id)
    return service.serialize_game(game)


@api.post("/game/{game_id}/player/", response=PlayerSchema)
def add_player(request, game_id: int, data: NameSchema):
    player = service.add_player(game_id, data.name)
    return service.serialize_player(player)


@api.post("/player/{player_id}/roll/", response=RollResult)
def roll(request, player_id: int):
    return service.roll_dice(player_id)


@api.post("/player/{player_id}/stand/", response=PlayerSchema)
def stand(request, player_id: int):
    player = service.stand_player(player_id)
    return service.serialize_player(player)


@api.get("/game/{game_id}/winner/", response=WinnerSchema)
def winner(request, game_id: int):
    return service.get_winner(game_id)
from ninja import Schema
from typing import List


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


class NameSchema(Schema):
    name: str

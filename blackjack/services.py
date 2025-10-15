import random
from blackjack.models import Game, Player

def dice_roll():
    return random.randint(1, 6)

def create_players(game: Game, players_data: list[dict]):
    for p_data in players_data:
        Player.objects.create(
            name=p_data["name"],
            score=0,
            stand=False,
            game=game
        )


def play(game, choice: str = "passe"):
    players = list(game.players.filter(stand=False).select_related("game"))
    if not players:
        game.ended = True
        game.save()
        return {"message": "La partie est terminée", "winner": end_game(game)}

    current_player = players[game.turn % len(players)]

    result = {
        "player": current_player.name,
        "action": choice,
        "rolled": None,
        "busted": False,
        "message": ""
    }

    if choice == "joue":
        roll = dice_roll()
        current_player.score += roll
        result["rolled"] = roll
        result["message"] = f"{current_player.name} lance le dé et obtient {roll}"

        if current_player.score > 21:
            current_player.stand = True
            result["busted"] = True
            result["message"] += f" {current_player.name} a dépassé 21 et est éliminé"

    elif choice == "p":
        current_player.stand = True
        result["message"] = f"{current_player.name} passe son tour"

    else:
        result["message"] = "Choix invalide. Tour passé automatiquement"
        current_player.stand = True

    current_player.save()
    game.turn += 1
    game.save()

    if all(p.stand for p in game.players.all()):
        game.ended = True
        game.save()
        winner = end_game(game)
        result["message"] += f" La partie est terminée ! Gagnant : {winner}."
        result["winner"] = winner

    return result

def play_full_game(game, choices: list[str] = None):
    choice_index = 0
    results = []

    while not game.ended:
        if choices and choice_index < len(choices):
            choice = choices[choice_index]
            choice_index += 1
        else:
            choice = "joue" 

        result = play(game, choice)
        results.append(result)

    return results


def end_game(game):
 
    players = list(game.players.all())
    valid_players = [p for p in players if p.score <= 21]

    if not valid_players:
        return "Aucun gagnant (tous ont dépassé 21)"

    winner = max(valid_players, key=lambda p: p.score)
    return winner.name


def get_scoreboard(game):
    return [
        {
            "id": p.id,
            "name": p.name,
            "score": p.score,
            "stand": p.stand
        }
        for p in game.players.all().order_by("-score")
    ]

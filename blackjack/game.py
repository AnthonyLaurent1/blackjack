import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bootcamp.settings')
django.setup()

from .models import Game       
from .services import play


def run():
    print("BlackJack")

    choice = input("Créer une nouvelle partie (n) ").lower().strip()

    if choice == "n":
        game_name = input("Nom de la partie : ")
        player_count = int(input("Nombre de joueur : "))
        player_names = [input(f"Nom du joueur {i+1} : ") for i in range(player_count)]

        game = Game.objects.create(name=game_name)
        game.start_game(player_names)

    else:
        print("Choix invalide")
        return
    
    print(f"Partie '{game.name}' démarrée (ID: {game.id})")
    while not game.ended:
        result = play(game)
        print(result)


if __name__ == "__main__":
    run()
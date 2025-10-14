from django.db import models

class Game(models.Model):
    name = models.CharField(max_length=250)
    turn = models.IntegerField(default=0)
    ended = models.BooleanField(default=False)

    def start_game(self):
        self.turn = 1
        self.ended = False
        self.save()

    def get_games(cls, game_id):
        return cls.objects.prefetch_related("players").filter(id=game_id).first()



class player(models.Model):
    name = models.CharField(max_length=50)
    score = models.IntegerField(default=0)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="players")
    stand = models.BooleanField(default=False)

   

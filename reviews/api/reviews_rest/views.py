from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json
from common.json import ModelEncoder
from .models import Review, Movie, UserVO


# Create your views here.
class UserVOEncoder(ModelEncoder):
    model = UserVO
    properties = ["user_name"]


class MovieEncoder(ModelEncoder):
    model = Movie
    properties = [
        "imdb_id",
        "title",
    ]


class ReviewsEncoder(ModelEncoder):
    model = Review
    properties = ["id", "title", "post", "rating", "date", "movie", "user"]
    encoders = {"movie": MovieEncoder(), "user": UserVOEncoder()}


@require_http_methods(["GET"])
def api_list_accountVOs(request):
    if request.method == "GET":
        users = UserVO.objects.all()

        return JsonResponse(users, safe=False, encoder=UserVOEncoder)

    return JsonResponse({"message": "no users in the database"})


@require_http_methods(["POST", "GET"])
def api_list_movies(request, imdb_id=None):
    if request.method == "GET":
        if imdb_id is None:
            movies = Movie.objects.all()
            return JsonResponse({"movies": movies}, encoder=MovieEncoder)

        movie = Movie.objects.get(imdb_id=imdb_id)
        return JsonResponse(movie, encoder=MovieEncoder, safe=False)
    else:
        content = json.loads(request.body)
        try:
            imdb_id = content["imdb_id"]
            movie_obj = Movie.objects.get(imdb_id=imdb_id)
            return JsonResponse({"message": "movie already in database"})

        except Movie.DoesNotExist:
            movie = Movie.objects.create(**content)
            movie_obj = Movie.objects.get(imdb_id=imdb_id)

        return JsonResponse(movie_obj, encoder=MovieEncoder, safe=False)


@require_http_methods(["GET"])
def api_list_reviews_by_imdb_id(request, imdb_id=None):
    if request.method == "GET":
        try:
            movie = Movie.objects.get(imdb_id=imdb_id)
            id = movie.id
        except Movie.DoesNotExist:
            return JsonResponse([], safe=False)
        reviews = Review.objects.filter(movie=id)
        return JsonResponse(reviews, ReviewsEncoder, safe=False)


@require_http_methods(["GET", "POST"])
def api_list_reviews(request, movie_id=None):
    if request.method == "GET":
        movies = Review.objects.all()
        return JsonResponse(movies, encoder=ReviewsEncoder, safe=False)

    else:
        content = json.loads(request.body)
        try:
            movie = Movie.objects.get(imdb_id=content["imdb_id"])
            content["movie"] = movie
            del content["imdb_id"]

        except Movie.DoesNotExist:
            return JsonResponse(
                {"ERROR MESSAGE": "Movie doesn't exist in the database"},
                status=401,
            )
        try:
            userVO = UserVO.objects.get(user_name=content["user_name"])
            content["user"] = userVO
            del content["user_name"]

        except UserVO.DoesNotExist:
            return JsonResponse(
                {
                    "message": "invalid username",
                },
                status=402,
            )
        try:
            review = Review.objects.create(**content)
            if content['title'] != '' and content['post'] != '':
                return JsonResponse(review, encoder=ReviewsEncoder, safe=False)
            else:
                return JsonResponse(
                    {
                        "message": "not all info filled"
                    },
                    status=404
                )
        except Exception as response:
            response = JsonResponse(
                {
                    "message": "not all information filled."
                }
            )
            response.status_code = 404
            return response


@require_http_methods(["DELETE", "PUT"])
def api_show_review(request, pk):
    if request.method == "DELETE":
        count, _ = Review.objects.filter(id=pk).delete()
        return JsonResponse({"deleted": count > 0})

    else:  # PUT
        content = json.loads(request.body)

        Review.objects.filter(id=pk).update(**content)
        review = Review.objects.get(id=pk)
        return JsonResponse(
            review,
            encoder=ReviewsEncoder,
            safe=False,
        )

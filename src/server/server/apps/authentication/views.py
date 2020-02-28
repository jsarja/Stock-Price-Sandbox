from django.http import HttpResponse


def sign_in(request):
    return HttpResponse("sign_in")

def sign_up(request):
    return HttpResponse("sign_up")

def sign_out(request):
    return HttpResponse("sign_out")
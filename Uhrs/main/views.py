from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.views import generic
from main.forms import *
from main.models import *
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect



class SignUp(generic.CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'signup.html'


@login_required
def form_hos(request):

    if request.method == "POST":
        form = PatientSignupForm(request.POST)
        if form.is_valid():
            patient = form.save(commit=False)
            patient.save()
            return redirect('/accounts/receipt/'+str(patient.id))
            #return HttpResponse('form submitted')
        else:
        	errors = form.errors
        	data = {"email":request.POST.get('email'),"first_name":request.POST.get('name'),"last_name":request.POST.get('age')}
        	form = PatientSignupForm(initial=data)

        return render(request, 'form_hos.html', {'form': form,'errors':errors})


    else:        
        form = PatientSignupForm()

    countries = Country.objects.all()
    genders = [x[0] for x in GENDER_CHOICES]
    doctors = [x[0] for x in DOCTOR_CHOICES]
    return render(request, 'form_hos.html', {'form': form ,'genders':genders, 'doctors':doctors , 'countries':countries})

   


def get_cities(request):
    if request.method=="POST":
        state_id = request.POST.get('state')
        state = State.objects.filter(id=int(state_id)).first()
        cities = City.objects.filter(state=state).order_by('name')
        data = [city.as_dict() for city in cities]
        return JsonResponse(data,safe=False)

def get_states(request):
    if request.method=="POST":
        country_id = request.POST.get('country')
        country = Country.objects.filter(id=int(country_id)).first()
        states = State.objects.filter(country=country).order_by('name')
        data = [state.as_dict() for state in states]
        return JsonResponse(data,safe=False)
        
@login_required
def receipt(request , ids):
	p_id = ids
	patient = Patient.objects.filter(id=p_id).first()
	return render(request , 'receipt.html' , {'patient':patient})

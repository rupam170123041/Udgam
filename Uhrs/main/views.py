from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.views import generic
from main.forms import *
from main.models import *
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout



def index(request):
    return render(request,'layouts/main.html')

def redirect_ac(request):
    if not request.user.is_authenticated:
        return redirect('/')
    if request.user.is_client:
        return redirect('/form')
    elif request.user.is_hospo:
        return redirect('/')
    else:
        return redirect('/')

def logout_view(request):
    logout(request)
    return redirect('index')

def signup(request):
    if request.user.is_authenticated:
        return redirect('/')
    if request.method == "POST":
        form = SignupForm(request.POST)
        if form.is_valid():
            if User.objects.filter(email=form.cleaned_data.get('email')).count() > 0:
                return render(request,"layouts/message.html",{"background":"bg-warning","title":"Error","head":"Error","body":"Email is already associated to an account."})
            else:
                user = form.save(commit=False)
                user.username = form.cleaned_data.get('email')
                user.first_name = request.POST.get('first')
                user.last_name = request.POST.get('last')
                user.is_active = True   # to make false for email verification 
                user.is_client = True
                user.save()
                raw_password = form.cleaned_data.get('password1')
                login(request, user, backend='django.contrib.auth.backends.AllowAllUsersModelBackend')
                #context = {
                    #"link": "https://techniche.org/activation_account/"+encrypt_val(str(user.id)+";"+user.first_name),
                    #"name" : user.first_name + " " + user.last_name,
                    #"tid" : user.docto_id
                #}
                #content = render_to_string("emails/activate_account.html",context)
                #Send(user.email,'Confirm your Techniche Registration',content,sender="info@techniche.org",replyto="info@techniche.org",name="Techniche, IIT Guwahati")
                return render(request,"layouts/message.html",{"background":"bg-success","title":"Verify your email","head":"Verify your email","body":"A confirmation mail has been sent to the registered email. Confirm it once to register for events."})
        else:
            errors = form.errors
            data = {"email":request.POST.get('email'),"first_name":request.POST.get('first'),"last_name":request.POST.get('last')}
            form = SignupForm(initial=data)
        return render(request, 'layouts/signup.html', {'form': form,'errors':errors})
    form = SignupForm()
    return render(request, 'layouts/signup.html', {'form': form})



def user_login(request):
    

    if request.method=="POST":
        username = User.objects.filter(email=request.POST['email']).first().username
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request,user, backend='django.contrib.auth.backends.AllowAllUsersModelBackend')
            if request.user.is_client: 
                return redirect('/appointment')
            else:
                return redirect('/clinic/dashboard')
        else:
            return render(request, 'layouts/user_login.html',{"messages":[["text-danger","Invalid Credentials."]]})
    return render(request, 'layouts/user_login.html')


@login_required
def form_hos(request):

    if request.user.is_client:

        if request.method == "POST":
            form = PatientSignupForm(request.POST)
            if form.is_valid():
                patient = form.save(commit=False)
                patient.user_id = request.user.id
                patient.save()
                #return redirect('/receipt/'+str(patient.id))
                return render(request,"layouts/message.html",{"background":"bg-success","title":"Appointed Submitted","head":"Appointed Submitted","body":"Wait for appointment to be confirmed."})
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
        doctors = [x[0] for x in DOCTYPE_CHOICES]
        return render(request, 'form_hos.html', {'form': form ,'genders':genders, 'doctors':doctors , 'countries':countries})

    else:
        return redirect('/')

   


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

def get_clinics(request):
    if request.method=="POST":
        city_id = request.POST.get('city')
        city = City.objects.filter(id=int(city_id)).first()
        clinics = Clinic.objects.filter(city=city).order_by('name')
        data = [clinic.as_dict() for clinic in clinics]
        return JsonResponse(data,safe=False)
        
@login_required
def receipt(request , ids):
    p_id = ids
    patient = Patient.objects.filter(id=p_id).first()
    return render(request , 'receipt.html' , {'patient':patient})


def clinic_dashboard(request):

    user = User.objects.filter(id=request.user.id , is_hospo=True).first()
    patients = Patient.objects.all()
    clinic = Clinic.objects.filter(user_id = request.user.id).first()

    if user is not None:

        if request.method == "POST":

            identifier = request.POST.get('extra_id')
            tr_id = request.POST.get('tr_id')
            patient = Patient.objects.filter(id=int(tr_id)).first()

            if int(identifier)==1:
                patient.is_accepted = 1
                #context = {
                    #"link": "https://techniche.org/techrep/activation/"+encrypt_val(str(techrep.user.id)+";"+techrep.user.first_name),
                    #"name" : techrep.user.first_name + " " + techrep.user.last_name,
                    #"tid" : techrep.user.t_id
                #}
                #content = render_to_string("emails/techrep_confirmation.html",context)
                #Send(techrep.email,'Techrep Registration Approved',content,sender="pr@techniche.org",replyto="pr@techniche.org",name="Techniche, IIT Guwahati")
                patient.save()
                return HttpResponse(tr_id)

            elif int(identifier)==0:
                patient.is_accepted = -1
                patient.save()
                return HttpResponse(tr_id)


        return render(request , "clinic/dashboard.html", {'patients':patients , 'clinic':clinic})

    else :
        return HttpResponse("Not Authorized") 


def accepted_patient(request):

    usr = User.objects.filter(id=request.user.id , is_hospo=True).first()
    data = Patient.objects.all()
    clinic = Clinic.objects.filter(user_id = request.user.id).first()

    if usr is not None:

        return render(request , "clinic/accepted.html" ,{'patients' :data})

    else :
        return HttpResponse("Not Authorized") 

def past_appt(request):
    pre_all = Patient.objects.filter(user_id=request.user.id).all().order_by('-id')
    clinic = Clinic.objects.filter(user_id = request.user.id).first()
    return render(request, 'past_appt.html', {'pre_all':pre_all , 'clinic':clinic})

def payment(request):
    return render(request,'payment.html')
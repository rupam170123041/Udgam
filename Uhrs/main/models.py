from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

from django.db import models
from django.utils.translation import ugettext as translate
from django.utils.timezone import now


GENDER_CHOICES = (
	('Male' , 'Male'),
	('Female' , 'Female'),

)

DOCTOR_CHOICES = (
	('A.k_Sharma' , 'A.K Sharma'),
)


class AutoCreatedUpdatedMixin(models.Model):

	created_at = models.DateTimeField(
		verbose_name=translate('created at'),
		unique=False,
		null=True,
		blank=True,
		db_index=True,
	)

	updated_at = models.DateTimeField(
		verbose_name=translate('updated at'),
		unique=False,
		null=True,
		blank=True,
		db_index=True,
	)

	class Meta:
		abstract = True

	def save(self, *args, **kwargs):
		if not self.created_at:
			self.created_at = now()
			self.updated_at = self.created_at
		else:
			auto_updated_at_is_disabled = kwargs.pop('disable_auto_updated_at', False)
			if not auto_updated_at_is_disabled:
				self.updated_at = now()
		super(AutoCreatedUpdatedMixin, self).save(*args, **kwargs)


class SoftDeleteMixin(models.Model):

	deleted_at = models.DateTimeField(
		verbose_name=translate('deleted at'),
		unique=False,
		null=True,
		blank=True,
		db_index=True,
	)

	class Meta:
		abstract = True

	def delete(self, using=None, keep_parents=False):
		self.deleted_at = now()
		kwargs = {
			'using': using,
		}
		if hasattr(self, 'updated_at'):
			kwargs['disable_auto_updated_at'] = True
		self.save(**kwargs)

class Country(AutoCreatedUpdatedMixin,SoftDeleteMixin):
	name = models.CharField(max_length=100)

	def __str__(self):
		return self.name


class State(AutoCreatedUpdatedMixin,SoftDeleteMixin):
	name = models.CharField(max_length=100)
	country = models.ForeignKey(Country,on_delete=models.CASCADE)

	def __str__(self):
		return self.name + ", " + self.country.name

	def as_dict(self):
		return {
			"name":self.name,
			"id":self.id
		}

class City(AutoCreatedUpdatedMixin,SoftDeleteMixin):
	name = models.CharField(max_length=100)
	state = models.ForeignKey(State,on_delete=models.CASCADE)

	def __str__(self):
		return self.name + ", " + self.state.name

	def as_dict(self):
		return {
			"name":self.name,
			"id":self.id
		}


class Patient(AutoCreatedUpdatedMixin,SoftDeleteMixin):
	reg_id = models.CharField(max_length=100, blank=True, unique=True, default=uuid.uuid4)
	name = models.CharField(max_length=50, blank=False)
	age = models.CharField(max_length=50, blank=False ,default=0)
	fees = models.CharField(max_length=50, blank=False , default=0)
	gender = models.CharField(max_length=100, blank=False , choices=GENDER_CHOICES)
	doctor = models.CharField(max_length=100, blank=False , choices=DOCTOR_CHOICES)
	father_husband_name = models.CharField(max_length=50, blank=False)
	contact = models.CharField(max_length=20, blank=False)
	adhaar = models.CharField(max_length=12, blank=False)
	epic = models.CharField(max_length=20, blank=False)
	pin = models.CharField(max_length=6, blank=False)
	email = models.EmailField(blank=False)
	address = models.CharField(max_length=100, blank=False)
	city = models.ForeignKey(City,on_delete=models.CASCADE, blank=False  , related_name='city', default=None)

	def save(self, *args, **kwargs):
		super(Patient, self).save(*args, **kwargs)
		self.reg_id = "UHRS"+str(12000+int(self.id))
		super(Patient, self).save(*args, **kwargs)

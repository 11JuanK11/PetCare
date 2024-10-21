package pet.care.petcare.service;

import pet.care.petcare.entity.Medication;
import pet.care.petcare.exception.ValidationException;

public interface IMedicationService {
    public Medication registerMedication(Medication medication) throws ValidationException;
}

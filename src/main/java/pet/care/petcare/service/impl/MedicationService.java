package pet.care.petcare.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pet.care.petcare.entity.Medication;
import pet.care.petcare.exception.ValidationException;
import pet.care.petcare.repository.IMedicationRepository;
import pet.care.petcare.service.IMedicationService;

import java.util.Optional;

@Service
public class MedicationService implements IMedicationService {

    @Autowired
    private IMedicationRepository medicationRepository;
    @Override
    public Medication registerMedication(Medication medication) throws ValidationException {
        Optional<Medication> existingMedication = medicationRepository.findByName(medication.getName());
        if (existingMedication.isPresent()) {
            throw new ValidationException("The medication already exists in the inventory");
        }
        return medicationRepository.save(medication);
    }
}

package pet.care.petcare.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pet.care.petcare.entity.Medication;
import pet.care.petcare.service.IMedicationService;

@RestController
@RequestMapping("/medications")
public class MedicationController {
    @Autowired
    private IMedicationService medicationService;

    @PostMapping("/")
    public ResponseEntity<?> registerMedication(@Valid @RequestBody Medication medication) {
        try {
            Medication newMedication = medicationService.registerMedication(medication);
            return ResponseEntity.ok("Medication successfully registered: " + newMedication.getName());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

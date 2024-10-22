package pet.care.petcare.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.Medication;
import pet.care.petcare.service.IMedicationService;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/")
    public ResponseEntity<List<Medication>> getAllMedications() {
        List<Medication> medications = medicationService.getAllMedications();
        return ResponseEntity.ok(medications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicationById(@PathVariable Long id) {
        Optional<Medication> medication = medicationService.getMedicationById(id);
        if (medication.isPresent()) {
            return ResponseEntity.ok(medication.get());
        } else {
            return ResponseEntity.status(404).body("Medication not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedication(@PathVariable Long id, @Valid @RequestBody Medication updatedMedication) {
        try {
            Medication medication = medicationService.updateMedication(id, updatedMedication);
            return ResponseEntity.ok("Medication successfully updated: " + medication.getName());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedication(@PathVariable Long id) {
        try {
            medicationService.deleteMedication(id);
            return ResponseEntity.ok("Medication successfully deleted");
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}

package pet.care.petcare.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.ClinicStaff;
import pet.care.petcare.exception.ValidationException;
import pet.care.petcare.service.impl.ClinicStaffService;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/clinic-staff")
public class ClinicStaffController {

    @Autowired
    private ClinicStaffService clinicStaffService;

    @PostMapping("/")
    public ResponseEntity<?> registerClinicStaff(@Valid @RequestBody ClinicStaff clinicStaff) {
        try {
            ClinicStaff newClinicStaff = clinicStaffService.insert(clinicStaff);
            return ResponseEntity.ok("Clinic Staff successfully registered: " + newClinicStaff.getName());
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "An unexpected error occurred."));
        }
    }

    @GetMapping("/")
    public ResponseEntity<List<ClinicStaff>> getAllClinicStaff() {
        List<ClinicStaff> medications = clinicStaffService.findAll();
        return ResponseEntity.ok(medications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClinicStaffById(@PathVariable Long id) {
        ClinicStaff clinicStaff = clinicStaffService.findById(id);
        if (clinicStaff != null) {
            return ResponseEntity.ok(clinicStaff);
        } else {
            return ResponseEntity.status(404).body("Clinic staff not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateClinicStaff(@PathVariable Long id, @Valid @RequestBody ClinicStaff updatedMedication) {
        try {
            ClinicStaff clinicStaff = clinicStaffService.update(updatedMedication);
            return ResponseEntity.ok("Clinic staff successfully updated: " + clinicStaff.getName());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClinicStaff(@PathVariable Long id) {
        try {
            clinicStaffService.deleteById(id);
            return ResponseEntity.ok("Clinic staff successfully deleted");
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

}

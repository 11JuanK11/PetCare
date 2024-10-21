package pet.care.petcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pet.care.petcare.entity.Diagnostic;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.service.impl.DiagnosticService;

@RestController
@RequestMapping("/diagnostics")
public class DiagnosticController {
    @Autowired
    private DiagnosticService diagnosticService;

    @PostMapping("/")
    public ResponseEntity<?> insert(@RequestBody Diagnostic diagnostic) {
        try {
            Diagnostic diagnosticSave = diagnosticService.create(diagnostic);
            return new ResponseEntity<>(diagnosticSave, HttpStatus.CREATED);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>("An error occurred while creating the diagnostic.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

package pet.care.petcare.service;

import pet.care.petcare.entity.Diagnostic;
import pet.care.petcare.entity.Treatment;
import pet.care.petcare.exception.ResourceNotFoundException;

public interface IDiagnosticService {
    public Diagnostic create(Diagnostic diagnostic) throws ResourceNotFoundException;
}

package pet.care.petcare.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pet.care.petcare.entity.Diagnostic;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.repository.IDiagnosticRepository;
import pet.care.petcare.service.IDiagnosticService;

@Service
public class DiagnosticService implements IDiagnosticService {
    @Autowired
    private IDiagnosticRepository diagnosticRepository;
    @Override
    public Diagnostic create(Diagnostic diagnostic) throws ResourceNotFoundException {
        if (diagnostic == null) {
            throw new ResourceNotFoundException("The diagnostic cannot be null.");
        }
        return diagnosticRepository.save(diagnostic);
    }
}

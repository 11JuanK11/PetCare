package pet.care.petcare.service.impl;

import org.springframework.stereotype.Service;
import pet.care.petcare.entity.ClinicStaff;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.exception.ValidationException;
import pet.care.petcare.service.IClinicStaffService;

import java.util.List;
import java.util.Optional;

@Service
public class ClinicStaffService implements IClinicStaffService {
    @Override
    public ClinicStaff registerClinicStaff(ClinicStaff clinicStaff) throws ValidationException {
        return null;
    }

    @Override
    public List<ClinicStaff> getAllClinicStaff() {
        return List.of();
    }

    @Override
    public Optional<ClinicStaff> getClinicStaffById(Long id) {
        return Optional.empty();
    }

    @Override
    public Optional<ClinicStaff> getClinicStaffByIdNumber(Long id) {
        return Optional.empty();
    }

    @Override
    public ClinicStaff updateClinicStaff(Long id, ClinicStaff updatedClinicStaff) throws ResourceNotFoundException {
        return null;
    }

    @Override
    public void deleteClinicStaff(Long id) throws ResourceNotFoundException {

    }
}

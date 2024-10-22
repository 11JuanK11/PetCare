package pet.care.petcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pet.care.petcare.service.IClinicStaffService;

@RestController
@RequestMapping("/clinic-staff")
public class ClinicStaffController {

    @Autowired
    private IClinicStaffService clinicStaffService;
}

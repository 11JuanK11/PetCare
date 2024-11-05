package pet.care.petcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pet.care.petcare.entity.Appointment;
import pet.care.petcare.service.impl.AppointmentService;

import java.util.List;

@RestController
@RequestMapping("/rest/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/create/{clinicStaffId}")
    public ResponseEntity<List<Appointment>> createAppointmentsForClinicStaff(@PathVariable Long clinicStaffId) {
        try {
            List<Appointment> appointments = appointmentService.createAppointmentsForClinicStaff(clinicStaffId);
            return new ResponseEntity<>(appointments, HttpStatus.CREATED);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

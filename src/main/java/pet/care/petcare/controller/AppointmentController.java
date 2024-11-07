package pet.care.petcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.Appointment;
import pet.care.petcare.service.impl.AppointmentService;

import java.time.LocalDate;
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

    @GetMapping("/appointments/available")
    @ResponseBody
    public List<Appointment> getAvailableAppointments(@RequestParam Long clinicStaffId, @RequestParam String date) {
        LocalDate appointmentDate = LocalDate.parse(date);
        return appointmentService.getAppointmentsByClinicStaffAndDate(clinicStaffId, appointmentDate);
    }

    @DeleteMapping("/delete/clinicStaff/{clinicStaffId}")
    public ResponseEntity<Void> deleteAppointmentsByClinicStaff(@PathVariable Long clinicStaffId) {
        try {
            appointmentService.deleteAppointmentsByClinicStaff(clinicStaffId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
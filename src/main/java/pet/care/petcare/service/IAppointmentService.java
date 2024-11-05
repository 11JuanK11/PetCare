package pet.care.petcare.service;

import pet.care.petcare.entity.Appointment;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface IAppointmentService {

    List<Appointment> createAppointmentsForClinicStaff(Long clinicStaffId);
    Appointment assignAppointment(Long clinicStaffId, LocalTime startTime, LocalTime endTime, LocalDate date);
    void deleteAppointment(Long appointmentId);
    Appointment readById(Long id);
}
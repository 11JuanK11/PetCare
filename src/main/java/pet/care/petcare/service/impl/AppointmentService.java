package pet.care.petcare.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pet.care.petcare.entity.Appointment;
import pet.care.petcare.entity.Schedule;
import pet.care.petcare.repository.IAppointmentRepository;
import pet.care.petcare.repository.IScheduleRepository;
import pet.care.petcare.service.IAppointmentService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AppointmentService implements IAppointmentService {


    @Autowired
    private IScheduleRepository scheduleRepository;

    @Autowired
    private IAppointmentRepository appointmentRepository;

    public List<Appointment> createAppointmentsForClinicStaff(Long clinicStaffId) {
        List<Appointment> appointments = new ArrayList<>();

        List<Schedule> schedules = scheduleRepository.findByClinicStaffId(clinicStaffId);

        for (Schedule schedule : schedules) {
            LocalTime currentStartTime = schedule.getStartTime();

            while (currentStartTime.isBefore(schedule.getEndTime())) {
                Appointment appointment = new Appointment();
                appointment.setStartTime(currentStartTime);
                appointment.setEndTime(currentStartTime.plusMinutes(30));
                appointment.setDate(schedule.getDate());
                appointment.setAvailable(true); // disponible
                appointment.setClinicStaff(schedule.getClinicStaff());

                appointments.add(appointment);
                currentStartTime = currentStartTime.plusMinutes(30);
            }
        }

        appointmentRepository.saveAll(appointments);

        return appointments;
    }

    public List<Appointment> getAppointmentsByClinicStaffAndDate(Long clinicStaffId, LocalDate date) {
        return appointmentRepository.findByClinicStaff_UserIdAndDate(clinicStaffId, date);
    }

    public void deleteAppointmentsByClinicStaff(Long clinicStaffId) {
        List<Appointment> appointments = appointmentRepository.findByClinicStaff_UserId(clinicStaffId);
        appointmentRepository.deleteAll(appointments);
    }


    @Override
    public Appointment assignAppointment(Long clinicStaffId, LocalTime startTime, LocalTime endTime, LocalDate date) {
        return null;
    }

    @Override
    public void deleteAppointment(Long appointmentId) {

    }

    @Override
    public Appointment readById(Long id) {
        return null;
    }
}

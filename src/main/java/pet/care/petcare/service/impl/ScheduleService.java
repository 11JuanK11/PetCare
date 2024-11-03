package pet.care.petcare.service.impl;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pet.care.petcare.entity.ClinicStaff;
import pet.care.petcare.entity.Schedule;
import pet.care.petcare.entity.WeeklySchedule;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.repository.IClinicStaffRepository;
import pet.care.petcare.repository.IScheduleRepository;
import pet.care.petcare.repository.IWeeklyScheduleRepository;
import pet.care.petcare.service.IScheduleService;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@Service
public class ScheduleService implements IScheduleService {

    @Autowired
    private IScheduleRepository scheduleRepository;

    @Autowired
    private IClinicStaffRepository clinicStaffRepository;

    @Autowired
    private IWeeklyScheduleRepository weeklyScheduleRepository;

    @Transactional
    @Override
    public Schedule assignSchedule(Long clinicStaffId, LocalDate date) {
        ClinicStaff clinicStaff = clinicStaffRepository.findById(clinicStaffId)
                .orElseThrow(() -> new IllegalArgumentException("Veterinarian not found"));

        // Verificar si el veterinario ya tiene un turno asignado para esa fecha
        Optional<Schedule> existingSchedule = scheduleRepository.findByClinicStaffAndDate(clinicStaff, date);
        if (existingSchedule.isPresent()) {
            throw new IllegalArgumentException("Veterinarian is already scheduled for this date");
        }

        // Verificar si hay algún horario en la fecha dada
        boolean exists = checkIfScheduleExists(date);
        if (exists) {
            throw new IllegalArgumentException("There is already a schedule assigned for this date");
        }

        Schedule schedule = new Schedule();
        schedule.setClinicStaff(clinicStaff);
        schedule.setDate(date);
        schedule.setAvailable(true); // Marcar como no disponible al crear el horario
        return scheduleRepository.save(schedule);
    }

    @Transactional
    @Override
    public void deleteSchedule(Long scheduleId) {
        scheduleRepository.deleteById(scheduleId);
    }

    @Override
    public Schedule readById(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
    }

    @Transactional
    @Override
    public Schedule updateSchedule(Long scheduleId, Map<String, Object> updates) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + scheduleId));

        if (updates.containsKey("weeklyScheduleId")) {
            // Suponiendo que el weeklyScheduleId es un Long
            Long weeklyScheduleId = ((Number) updates.get("weeklyScheduleId")).longValue();
            WeeklySchedule weeklySchedule = weeklyScheduleRepository.findById(weeklyScheduleId)
                    .orElseThrow(() -> new ResourceNotFoundException("WeeklySchedule not found with id: " + weeklyScheduleId));
            schedule.setWeeklySchedule(weeklySchedule);
        }

        return scheduleRepository.save(schedule);
    }

    public boolean checkIfScheduleExists(LocalDate startDate) {
        Optional<Schedule> existingSchedule = scheduleRepository.findByDate(startDate);
        return existingSchedule.isPresent();
    }



}
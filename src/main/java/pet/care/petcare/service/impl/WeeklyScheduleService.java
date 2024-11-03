package pet.care.petcare.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pet.care.petcare.entity.Schedule;
import pet.care.petcare.entity.WeeklySchedule;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.repository.IWeeklyScheduleRepository;
import pet.care.petcare.service.IWeeklyScheduleService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class WeeklyScheduleService implements IWeeklyScheduleService {

    @Autowired
    private IWeeklyScheduleRepository weeklyScheduleRepository;

    @Transactional
    public WeeklySchedule create(WeeklySchedule weeklySchedule) throws ResourceNotFoundException {
        if (weeklySchedule == null || weeklySchedule.getSchedules() == null || weeklySchedule.getSchedules().isEmpty()) {
            throw new IllegalArgumentException("WeeklySchedule and its schedules cannot be null or empty.");
        }

        Schedule firstSchedule = weeklySchedule.getSchedules().get(0);
        LocalDate startDate = firstSchedule.getDate();

        weeklySchedule.setStartDate(startDate);

        List<Schedule> schedules = new ArrayList<>(weeklySchedule.getSchedules());
        weeklySchedule.setSchedules(new ArrayList<>());

        WeeklySchedule savedWeeklySchedule = weeklyScheduleRepository.saveAndFlush(weeklySchedule);

        for (Schedule schedule : schedules) {
            if (schedule.getClinicStaff() == null) {
                throw new ResourceNotFoundException("Schedule with null clinicStaff is not allowed.");
            }
            schedule.setWeeklySchedule(savedWeeklySchedule);
            savedWeeklySchedule.getSchedules().add(schedule);
        }

        return weeklyScheduleRepository.save(savedWeeklySchedule);
    }


    @Override
    public List<WeeklySchedule> readAll() {
        return weeklyScheduleRepository.findAll();
    }
}

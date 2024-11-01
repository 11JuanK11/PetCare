package pet.care.petcare.service;

import pet.care.petcare.entity.Schedule;

import java.time.LocalDate;

public interface IScheduleService {
    Schedule assignSchedule(Long clinicStaffId, LocalDate date);
    void deleteSchedule(Long scheduleId);
    Schedule readById(Long id);
}

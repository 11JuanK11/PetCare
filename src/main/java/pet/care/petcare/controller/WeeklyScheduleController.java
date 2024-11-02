package pet.care.petcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.WeeklySchedule;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.service.impl.WeeklyScheduleService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rest/weeklyschedule")
public class WeeklyScheduleController {

    @Autowired
    private WeeklyScheduleService weeklyScheduleService;

    @PostMapping("/create")
    public ResponseEntity<?> createWeeklySchedule(@RequestBody WeeklySchedule weeklySchedule) {
        try {
            WeeklySchedule createdSchedule = weeklyScheduleService.create(weeklySchedule);
            return new ResponseEntity<>(createdSchedule, HttpStatus.CREATED);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(Map.of("error", ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(Map.of("error", "An error occurred while creating the weekly schedule."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @GetMapping("/")
    public ResponseEntity<List<pet.care.petcare.entity.WeeklySchedule>> getAllWeeklySchedules() {
        return null;
    }
}
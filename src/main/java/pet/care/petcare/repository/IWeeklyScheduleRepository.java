package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pet.care.petcare.entity.WeeklySchedule;

public interface IWeeklyScheduleRepository extends JpaRepository<WeeklySchedule, Long> {
}

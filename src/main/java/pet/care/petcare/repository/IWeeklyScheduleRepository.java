package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import pet.care.petcare.entity.WeeklySchedule;

import java.util.Optional;

public interface IWeeklyScheduleRepository extends JpaRepository<WeeklySchedule, Long> {
    @EntityGraph(attributePaths = "schedules")
    Optional<WeeklySchedule> findById(Long id);
}

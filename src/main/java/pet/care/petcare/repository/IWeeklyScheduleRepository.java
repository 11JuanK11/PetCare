package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pet.care.petcare.entity.WeeklySchedule;

import java.time.LocalDate;
import java.util.Optional;

public interface IWeeklyScheduleRepository extends JpaRepository<WeeklySchedule, Long> {
    @EntityGraph(attributePaths = "schedules")
    Optional<WeeklySchedule> findById(Long id);

    @Query("SELECT ws FROM WeeklySchedule ws WHERE ws.startDate = :startDate")
    Optional<WeeklySchedule> findByStartDate(@Param("startDate") LocalDate startDate);
}

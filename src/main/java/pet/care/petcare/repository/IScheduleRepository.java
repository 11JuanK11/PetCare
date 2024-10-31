package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.ClinicStaff;
import pet.care.petcare.entity.Schedule;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface IScheduleRepository extends JpaRepository<Schedule, Long> {
    Optional<Schedule> findByClinicStaffAndDate(ClinicStaff clinicStaff, LocalDate date);

    @Query("SELECT s FROM Schedule s WHERE s.date = :date")
    Optional<Schedule> findByDate(@Param("date") LocalDate date);
}

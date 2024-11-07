package pet.care.petcare.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.Appointment;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IAppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByClinicStaff_UserIdAndDate(Long userId, LocalDate date);
    List<Appointment> findByClinicStaff_UserId(Long clinicStaffId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Appointment a WHERE a.clinicStaff.id = :clinicStaffId AND a.date = :date")
    void deleteByClinicStaffIdAndDate(Long clinicStaffId, LocalDate date);

    @Transactional
    @Modifying
    @Query("DELETE FROM Appointment a WHERE a.date = :date")
    void deleteByDate(LocalDate date);


    List<Appointment> findByDate(LocalDate date);

}

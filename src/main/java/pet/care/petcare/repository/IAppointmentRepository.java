package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.Appointment;

@Repository
public interface IAppointmentRepository extends JpaRepository<Appointment, Long> {
}

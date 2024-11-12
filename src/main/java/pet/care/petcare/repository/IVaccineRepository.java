package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.Vaccine;

@Repository
public interface IVaccineRepository extends JpaRepository<Vaccine, Long> {
}

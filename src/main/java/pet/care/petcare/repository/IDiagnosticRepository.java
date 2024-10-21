package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.Diagnostic;

@Repository
public interface IDiagnosticRepository extends JpaRepository<Diagnostic, Long> {
}

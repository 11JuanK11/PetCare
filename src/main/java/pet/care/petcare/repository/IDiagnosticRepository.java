package pet.care.petcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pet.care.petcare.entity.Diagnostic;

import java.util.Optional;

@Repository
public interface IDiagnosticRepository extends JpaRepository<Diagnostic, Long> {
    Optional<Diagnostic> findByRecipeId(Long recipeId);
}

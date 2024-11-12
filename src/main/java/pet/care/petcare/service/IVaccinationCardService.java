package pet.care.petcare.service;

import pet.care.petcare.entity.VaccinationCard;

import java.util.List;
import java.util.Optional;

public interface IVaccinationCardService {
    public VaccinationCard insertVaccinationCard(VaccinationCard vaccinationCard) throws IllegalArgumentException;
    public List<VaccinationCard> getAllVaccinationCards();
    public Optional<VaccinationCard> getVaccinationCardById(Long id);
}

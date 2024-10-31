package pet.care.petcare.service;

import pet.care.petcare.entity.Pet;

import java.util.List;

public interface IPetService extends ICRUDService<Pet> {
    public List<Pet> findByName(String name) throws RuntimeException;
}

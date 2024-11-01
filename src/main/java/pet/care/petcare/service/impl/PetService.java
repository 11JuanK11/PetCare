package pet.care.petcare.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pet.care.petcare.entity.Pet;
import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.repository.IPetRepository;
import pet.care.petcare.service.IPetService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PetService implements IPetService {
    @Autowired
    private IPetRepository petRepository;

    @Override
    public Pet insert(Pet entity) throws RuntimeException {
        if (entity == null) {
            throw new ResourceNotFoundException("User information is missing");
        }
        return petRepository.save(entity);
    }

    @Override
    public Pet findById(Long id) throws RuntimeException {
        return petRepository.findById(id).orElseThrow(() -> {
            throw new ResourceNotFoundException("Clinic staff not found by: " + id);
        });
    }

    @Override
    public List<Pet> findAll() {
        return petRepository.findAll();
    }

    @Override
    public Pet update(Pet entity) throws RuntimeException {
        Optional<Pet> entityFound = petRepository.findById(entity.getId());

        if (entityFound.isEmpty()) {
            throw new ResourceNotFoundException("Pet not found.");
        }else {
            Pet pet = entityFound.get();

            if (entity.getId() != null) {
                pet.setId(entity.getId());
            }
            if (entity.getName() != null) {
                pet.setName(entity.getName());
            }
            if (entity.getAge() != null) {
                pet.setAge(entity.getAge());
            }
            if (entity.getRace() != null) {
                pet.setRace(entity.getRace());
            }
            if (entity.getWeight() != null) {
                pet.setWeight(entity.getWeight());
            }
            return petRepository.save(pet);
        }
    }

    @Override
    public void deleteById(Long id) throws RuntimeException {
        if (!petRepository.existsById(id)){
            throw new ResourceNotFoundException("Pet not found");
        }else{
            petRepository.deleteById(id);
        }

    }

    @Override
    public List<Pet> findByName(String name) throws RuntimeException {
        ArrayList<Pet> petsByName= new ArrayList<>();
        for (Pet pets: petRepository.findAll()){
            if(pets.getName().toLowerCase().contains(name.toLowerCase())){
                petsByName.add(pets);
            }
        }
        return petsByName;
    }

}

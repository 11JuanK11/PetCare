package pet.care.petcare.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pet.care.petcare.entity.Pet;
import pet.care.petcare.exception.ValidationException;
import pet.care.petcare.service.IPetService;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/rest/pets")
public class PetController {
    @Autowired
    private IPetService petService;

    @PostMapping("/")
    public ResponseEntity<?> registerPet(@Valid @RequestBody Pet pet) {
        try {
            Pet newpet = petService.insert(pet);
            return ResponseEntity.ok("Pet successfully registered: " + newpet.getName());
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "An unexpected error occurred."));
        }
    }


    @GetMapping("/")
    public ResponseEntity<List<Pet>> getAllPets() {
        List<Pet> pets = petService.findAll();
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/name/{petName}")
    public ResponseEntity<List<Pet>> getAllPetsByName(@PathVariable String petName) {
        List<Pet> pets = petService.findByName(petName);
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPetById(@PathVariable Long id) {
        Pet pet = petService.findById(id);
        if (pet != null) {
            return ResponseEntity.ok(pet);
        } else {
            return ResponseEntity.status(404).body("pet not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePet(@RequestBody Pet updatedpet) {
        try {
            Pet pet = petService.update(updatedpet);
            return ResponseEntity.ok("pet successfully updated: " + pet.getName());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable Long id) {
        try {
            petService.deleteById(id);
            return ResponseEntity.ok("pet successfully deleted");
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}

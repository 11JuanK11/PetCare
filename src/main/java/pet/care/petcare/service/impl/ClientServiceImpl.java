package pet.care.petcare.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pet.care.petcare.entity.Client;

import pet.care.petcare.exception.ResourceNotFoundException;
import pet.care.petcare.repository.IClientRepository;
import pet.care.petcare.service.UserService;

import java.util.List;

@Service
public class ClientServiceImpl extends UserService<Client> {
    @Autowired
    private IClientRepository clientRepository;


    @Override
    public Client insert(Client entity) throws RuntimeException {
        if (entity == null) {
            throw new ResourceNotFoundException("User information is missing");
        }
        checkExistence(entity.getUsername());
        entity.setRole("CLIENT");
        entity.setPassword(this.cryptPasswordEncoder.encode(entity.getPassword()));
        return clientRepository.save(entity);
    }

    @Override
    public Client findById(Long id) throws RuntimeException {
        return clientRepository.findById(id).orElseThrow(() -> {
            throw new ResourceNotFoundException("Client not found by: " + id);
        });
    }

    @Override
    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    @Override
    public Client update(Client entity) throws RuntimeException {
        return null;
    }

    @Override
    public void deleteById(Long id) throws RuntimeException {
        if (!clientRepository.existsById(id)){
            throw new ResourceNotFoundException("Client not found");
        }
        clientRepository.deleteById(id);
    }
}

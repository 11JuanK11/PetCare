package pet.care.petcare.service;

import pet.care.petcare.exception.ResourceNotFoundException;

import java.util.List;

public interface ICRUDService<T> {

    public T insert(T entity) throws RuntimeException;

    public T findById(Long id) throws RuntimeException;

    public List<T> findAll();

    public T update(Long id) throws RuntimeException;

    public void deleteById(Long id) throws RuntimeException;

}

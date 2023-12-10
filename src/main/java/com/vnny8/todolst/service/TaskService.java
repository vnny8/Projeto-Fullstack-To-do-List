package com.vnny8.todolst.service;

import com.vnny8.todolst.model.Task;
import com.vnny8.todolst.repository.TaskRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TaskService {

    private TaskRepository taskRepository;

    public Task criarTarefa(Task tarefa){
        return taskRepository.save(tarefa);
    }

    public List<Task> listarTarefas(){
        return taskRepository.findAll();
    }

    public ResponseEntity<Task> encontrarTarefaPorID(Long id){
        return taskRepository.findById(id)
                .map(task -> ResponseEntity.ok().body(task))
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Task> atualizarTarefaPorID(Task tarefa, Long id){
        return taskRepository.findById(id)
                .map(taskParaAtualizar ->{
                    taskParaAtualizar.setTitulo(tarefa.getTitulo());
                    taskParaAtualizar.setDescricao(tarefa.getDescricao());
                    taskParaAtualizar.setPrazoFinal(tarefa.getPrazoFinal());
                    Task Atualizado = taskRepository.save(taskParaAtualizar);
                    return ResponseEntity.ok().body(Atualizado);
                }).orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Object> deletarPorID(Long id){
        return taskRepository.findById(id)
                .map(tarefaParaDeletar -> {
                    taskRepository.deleteById(id);
                    return ResponseEntity.noContent().build();
                }).orElse(ResponseEntity.notFound().build());
    }
}

package com.vnny8.todolst.controller;

import com.vnny8.todolst.model.Task;
import com.vnny8.todolst.service.TaskService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
@Slf4j
public class TaskController {

    TaskService taskService;

    @ApiOperation(value = "Criando nova tarefa")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message="Tarefa criada com sucesso!"),
            @ApiResponse(code = 500, message="Erro ao criar tarefa. ")
    })

    @PostMapping("/Task")
    @ResponseStatus(HttpStatus.CREATED)
    public Task criarTarefa(@RequestBody Task tarefa){
        log.info("Criando uma nova tarefa [{}]", tarefa);
        return taskService.criarTarefa(tarefa);
    }

    @ApiOperation(value = "Listando todas as tarefas")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message="Tarefas listadas com sucesso"),
            @ApiResponse(code = 500, message="Erro ao listas tarefas. ")
    })
    @GetMapping("/Task")
    @ResponseStatus(HttpStatus.OK)
    public List<Task> getTarefas(){
        log.info("Listando todas as tarefas cadastradas");
        return taskService.listarTarefas();
    }

    @ApiOperation(value = "Buscando tarefa por ID")
    @ApiResponses( value ={
            @ApiResponse(code = 200, message = "Tarefa encontrada com sucesso!"),
            @ApiResponse(code = 404, message = "Nenhuma tarefa encontrada com o id inserido.")

    })
    @GetMapping("/Task/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Task> getTarefaPorID(@PathVariable (value = "id") long id){
        log.info("Buscando tarefa por ID [{}]", id);
        return taskService.encontrarTarefaPorID(id);
    }

    @ApiOperation(value = "Atualizando uma tarefa")
    @ApiResponses( value ={
            @ApiResponse(code = 200, message = "Tarefa atualizada com sucesso!"),
            @ApiResponse(code = 404, message = "Erro ao atualizar tarefa.")

    })
    @PutMapping("/Task/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Task> atualizarTarefaPorID(@PathVariable (value = "id") Long id, @RequestBody Task tarefa){
        log.info("Atualizando tarefa com o id [{}] com as novas informações: [{}]", id, tarefa);
        return taskService.atualizarTarefaPorID(tarefa, id);
    }

    @ApiOperation(value = "Excluindo uma tarefa")
    @ApiResponses( value ={
            @ApiResponse(code = 204, message = "Tarefa excluída com sucesso!"),
            @ApiResponse(code = 404, message = "Erro ao excluir tarefa.")

    })
    @DeleteMapping("/Task/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Object> deletarPorID(@PathVariable (value = "id") long id){
        log.info("Excluindo tarefa com ID [{}]", id);
        return taskService.deletarPorID(id);
    }

}

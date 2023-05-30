import { IRouter, Request, Response, Router } from "express";
import { ControllerEntity } from "./ControllerEntity";
import { Service } from "../Service/Service";
import { Mapper } from "../Mapper/Mapper";

export class RouterEntity<E, D, S> {
    private router = Router();
    private controllerEntity = new ControllerEntity<E, D, S>();

    constructor(service: Service<E, S>, mapper: Mapper<E, D, S>) {
        this.router.post("/add", (req: Request, res: Response) => this.controllerEntity.addRoute(req, res, service, mapper));
        this.router.post("/delete", (req: Request, res: Response) => this.controllerEntity.deleteRoute(req, res, service, mapper));
        this.router.post("/getById", (req: Request, res: Response) => this.controllerEntity.findByIdRoute(req, res, service, mapper));
        this.router.get("/getAll", (req: Request, res: Response) => this.controllerEntity.findAll(req, res, service, mapper));
        this.router.post("/update", (req: Request, res: Response) => this.controllerEntity.update(req, res, service, mapper));
    }

    public getRouter(): Router {
        return this.router;
    }
}

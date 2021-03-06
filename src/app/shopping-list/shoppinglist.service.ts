import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";

@Injectable({
    providedIn: 'root'
})
export class ShoppingListService{

    listChanged = new Subject<Ingredient[]>();
    ingredientSelectedIndex = new Subject<number>();

    // private ingredients: Ingredient[] = [
    //     new Ingredient('cheese', 20)
    //   ];

    private ingredients: Ingredient[] = [];

    updateFromServer(list: Ingredient[]){
        this.ingredients = list;
        this.listChanged.next(this.ingredients.slice());
    }

    getIngredients(){
        return this.ingredients.slice();
    }

    addItem(item: Ingredient){
        // console.log("AddItem called");
        this.ingredients.push(item);
        this.listChanged.next(this.ingredients.slice());
    }

    addManyItems(ingredients: Ingredient[]){
        //Note that this will work but we are emitting many unnecessary events, therefore use code below 
        // for(let item of ingredients){
        //     this.addItem(item);
        //   }

        //Take note of the spread operator!!!
        this.ingredients.push(...ingredients);
        this.listChanged.next(this.ingredients.slice());
    }

    onEditItem(index: number, item: Ingredient){
      this.ingredients[index].name = item.name;
      this.ingredients[index].amount = item.amount;
      this.listChanged.next(this.ingredients.slice());
    }

    onDeleteItem(index: number){
      this.ingredients.splice(index, 1);
      this.listChanged.next(this.ingredients.slice());
    }

    // deleteItem(item: Ingredient){
    //     let index = this.ingredients.findIndex((element)=>{
    //         if((element.name === item.name) && (element.amount === item.amount)){
    //           return true;
    //         }else{
    //           return false;
    //         }
    //       });
          
    //       if(index !== -1){
    //         this.ingredients.splice(index, 1);
    //       }else{
    //         return console.log("Entry Does not exist");
    //       }

    //     this.listChanged.next(this.ingredients.slice());
    // }
}
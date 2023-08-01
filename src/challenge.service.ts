import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class ChallengeService {
  tryConnection(): Promise<string> {
    return new Promise((resolve) => {
      mongoose.connect('mongodb://weinnovate:weinnovate@mongo-server:27017/weinnovate?authSource=admin').then(() => {
        resolve(`
          <div style="background-color: #00bfff30;width: 600px;padding: 16px;">
            <h1>Parabéns!!!</h1> 
            <p>O container app se conectou corretamente ao container mongo-server!</p>
          </div>
        `);
      }).catch((err) => {
        resolve(`
            <div style="background-color: #ff000030;width: 600px;padding: 16px;">
              <h1>Ops!!!</h1>               
              <p><b>Algo deu errado!</b> Verifique se você está com o Docker rodando e se o container do MongoDB está ativo. Abaixo detalhes:</p>               
              <code style="background-color: #eee;border: 1px solid #999;display: block;padding: 20px;">${JSON.stringify(err, null, 2)}}</code>
            </div>
          `);
      });
    });
  }
}

package cn.cjq.service.impl;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.cjq.bean.ProcLogin;
import cn.cjq.bean.ProcStock;
import cn.cjq.bean.ProcStockHisIns;
import cn.cjq.bean.ProcStockSyncUpd;
import cn.cjq.bean.ProcStockUpd;
import cn.cjq.bean.ProcStockDel;
import cn.cjq.bean.StockVO;
import cn.cjq.mapper.StockMapper;
import cn.cjq.procedure.ProcSupport;
import cn.cjq.service.LoginService;
import cn.cjq.service.StockService;

@Service
@Transactional
public class LoginServiceImpl implements LoginService {

	@Override
	public ProcLogin login(ProcLogin proc) {
		ProcSupport.callProc(proc);
		return proc;
	}
}

package cn.cjq.procedure;

import java.sql.Connection;
import java.sql.SQLException;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;


import cn.cjq.jdbc.ConnectionDB;


public class ProcSupport {
	private static Logger logger = LogManager.getLogger("ProcSupport");

	public static <T> void callProc(final T obj, Connection conn) {
		try {
			Procedure<T> proc = new Procedure<T>(obj);
			proc.execute(conn);
		} catch (Exception e) {
		    logger.error("Procedure：" + obj.getClass().getName());
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					logger.error("Error occurred when closing connection...", e);
				}
			}
		}
	}
	/**
	 * Call procedure
	 * @param obj Procedure define
	 */
	public static <T> void callProc(final T obj) {
		Connection conn = null;
		try {
			Procedure<T> proc = new Procedure<T>(obj);
			conn = findConnection();
			proc.execute(conn);
		} catch (SQLException e) {
		    logger.error("Procedure：" + obj.getClass().getName());
			logger.error("SQLException", e);
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					logger.error("Error occurred when closing connection...", e);
				}
			}
		}
	}
	/**
	 * Find connection from the current thread.
	 * @return DB connection
	 * @throws SQLException
	 */
	protected static Connection findConnection() throws SQLException{
		ConnectionDB c=new ConnectionDB();
		return c.getConnection();
	}
}
